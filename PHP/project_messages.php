<?php
require_once 'session_config.php';

require_once __DIR__ . '/../vendor/autoload.php';

if (!isset($_SESSION['id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['success' => false, 'message' => 'You must be logged in to submit a message.']);
    exit;
}

$user_id = $_SESSION['id'];

$allowed_origins = [
    'http://localhost:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('HTTP/1.1 403 Forbidden');
    exit;
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

if (!isset($_POST['project_id']) || !is_numeric($_POST['project_id'])) {
    echo json_encode(['success' => false, 'message' => 'Project ID is required.']);
    exit;
}

if (!isset($_POST['message']) || empty(trim($_POST['message']))) {
    echo json_encode(['success' => false, 'message' => 'Message is required.']);
    exit;
}

$project_id = (int) $_POST['project_id'];
$message = trim($_POST['message']);

$allowed_types = ['image/png', 'image/jpeg', 'application/pdf'];
$max_file_size = 10 * 1024 * 1024;  // 10MB
$max_files = 5;

$servername = '127.0.0.1';
$username = 'root';
$passwordServer = '';
$dbname = 'hertford_standard';

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $passwordServer);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    error_log('Database connection failed: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server configuration error.']);
    exit;
}

try {
    $adminSql = 'SELECT is_admin FROM users WHERE id = :user_id';
    $adminStmt = $conn->prepare($adminSql);
    $adminStmt->execute([':user_id' => $user_id]);
    $user = $adminStmt->fetch(PDO::FETCH_ASSOC);
    $is_admin = ($user && $user['is_admin'] == 1);

    $verifySql = 'SELECT p.id, p.title, u.email AS owner_email, u.name AS owner_name 
              FROM projects p 
              INNER JOIN users u ON p.user_id = u.id 
              WHERE p.id = :project_id';

    if (!$is_admin) {
        $verifySql .= ' AND p.user_id = :user_id';
    }

    $verifyStmt = $conn->prepare($verifySql);
    $params = [':project_id' => $project_id];
    if (!$is_admin) {
        $params[':user_id'] = $user_id;
    }
    $verifyStmt->execute($params);
    $projectData = $verifyStmt->fetch(PDO::FETCH_ASSOC);

    if (!$projectData) {
        echo json_encode(['success' => false, 'message' => 'Project not found or access denied.']);
        exit;
    }

    $projectTitle = $projectData['title'] ?? 'Unknown Project';

    if ($verifyStmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Project not found or access denied.']);
        exit;
    }

    $conn->beginTransaction();

    $sql = 'INSERT INTO project_messages (project_id, message, created_by, created_at) 
            VALUES (:project_id, :message, :created_by, NOW())';

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':project_id' => $project_id,
        ':message' => $message,
        ':created_by' => $user_id
    ]);

    $message_id = $conn->lastInsertId();

    $uploaded_files = 0;
    $skipped_files = 0;
    $file_errors = [];

    if (isset($_FILES['attachments']) && !empty($_FILES['attachments']['name'][0])) {
        $files = $_FILES['attachments'];
        $file_count = count($files['name']);

        if ($file_count > $max_files) {
            $conn->rollBack();
            echo json_encode(['success' => false, 'message' => "Maximum {$max_files} files allowed per submission."]);
            exit;
        }

        for ($i = 0; $i < $file_count; $i++) {
            if ($files['error'][$i] === UPLOAD_ERR_NO_FILE) {
                continue;
            }

            if ($files['error'][$i] !== UPLOAD_ERR_OK) {
                $skipped_files++;
                $file_errors[] = "File '{$files['name'][$i]}' upload failed with error code: {$files['error'][$i]}";
                continue;
            }

            $file_name = $files['name'][$i];
            $file_type = $files['type'][$i];
            $file_size = $files['size'][$i];
            $file_tmp = $files['tmp_name'][$i];

            if (!in_array($file_type, $allowed_types)) {
                $skipped_files++;
                $file_errors[] = "File '{$file_name}' skipped: Invalid file type. Allowed: PNG, JPEG, PDF";
                continue;
            }

            if ($file_size > $max_file_size) {
                $skipped_files++;
                $file_errors[] = "File '{$file_name}' skipped: Exceeds 10MB limit";
                continue;
            }

            $file_content = file_get_contents($file_tmp);
            if ($file_content === false) {
                $skipped_files++;
                $file_errors[] = "File '{$file_name}' skipped: Could not read file content";
                continue;
            }

            $sql_attachment = 'INSERT INTO message_attachments 
                              (project_message_id, attachment, attachment_name, attachment_type, uploaded_by, uploaded_at) 
                              VALUES (:project_message_id, :attachment, :attachment_name, :attachment_type, :uploaded_by, NOW())';

            $stmt_attachment = $conn->prepare($sql_attachment);
            $stmt_attachment->bindParam(':project_message_id', $message_id, PDO::PARAM_INT);
            $stmt_attachment->bindParam(':attachment', $file_content, PDO::PARAM_LOB);
            $stmt_attachment->bindParam(':attachment_name', $file_name, PDO::PARAM_STR);
            $stmt_attachment->bindParam(':attachment_type', $file_type, PDO::PARAM_STR);
            $stmt_attachment->bindParam(':uploaded_by', $user_id, PDO::PARAM_INT);

            if ($stmt_attachment->execute()) {
                $uploaded_files++;
            } else {
                $skipped_files++;
                $file_errors[] = "File '{$file_name}' skipped: Database insertion failed";
            }
        }
    }

    $conn->commit();

    try {
        $userSql = 'SELECT name, email FROM users WHERE id = :user_id';
        $userStmt = $conn->prepare($userSql);
        $userStmt->execute([':user_id' => $user_id]);
        $messagingUser = $userStmt->fetch(PDO::FETCH_ASSOC);

        $config = parse_ini_file(__DIR__ . '/../.env', false, INI_SCANNER_RAW);

        if ($config === false) {
            error_log('Notification system: Failed to parse .env file for mail credentials');
        } else {
            $mailUsername = $config['MAIL_USERNAME'] ?? '';
            $mailPassword = $config['MAIL_PASSWORD'] ?? '';

            if (empty($mailUsername) || empty($mailPassword)) {
                error_log('Notification system: Gmail credentials not found in .env file');
            } else {
                $recipients = [];

                if ($is_admin) {
                    $recipients[] = [
                        'email' => $projectData['owner_email'],
                        'name' => $projectData['owner_name']
                    ];
                } else {
                    $adminSql = 'SELECT email, name FROM users WHERE is_admin = 1 AND is_verified = 1';
                    $adminStmt = $conn->prepare($adminSql);
                    $adminStmt->execute();
                    $recipients = $adminStmt->fetchAll(PDO::FETCH_ASSOC);
                }

                $subject = 'New Message Added to Project - Hertford Standard';

                $emailBody = "A new message has been added to a project on Hertford Standard.\n\n";
                $emailBody .= 'Project Title: ' . $projectTitle . "\n";
                $emailBody .= 'Project ID: ' . $project_id . "\n";
                $emailBody .= 'Message ID: ' . $message_id . "\n\n";
                $emailBody .= 'Submitted by: ' . ($messagingUser['name'] ?? 'Unknown') . "\n";
                $emailBody .= "Submitter's Email: " . ($messagingUser['email'] ?? 'Unknown') . "\n\n";
                $emailBody .= "Message Content:\n\"" . $message . "\"\n\n";
                $emailBody .= "Please log in to your dashboard to review this message.\n";

                $successCount = 0;
                $failureCount = 0;

                if (!empty($recipients)) {
                    foreach ($recipients as $recipient) {
                        $targetEmail = $recipient['email'];
                        $targetName = $recipient['name'];

                        if (empty($targetEmail) || !filter_var($targetEmail, FILTER_VALIDATE_EMAIL)) {
                            error_log("Notification: Invalid email address for user: {$targetName}");
                            $failureCount++;
                            continue;
                        }

                        $mail = new \PHPMailer\PHPMailer\PHPMailer(true);

                        try {
                            $mail->SMTPDebug = \PHPMailer\PHPMailer\SMTP::DEBUG_OFF;
                            $mail->isSMTP();
                            $mail->Host = 'smtp.gmail.com';
                            $mail->SMTPAuth = true;
                            $mail->Username = $mailUsername;
                            $mail->Password = $mailPassword;
                            $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
                            $mail->Port = 587;

                            $mail->setFrom($mailUsername, 'Hertford Standard');
                            $mail->addAddress($targetEmail, $targetName);

                            $mail->isHTML(false);
                            $mail->Subject = $subject;
                            $mail->Body = $emailBody;

                            $mail->send();
                            $successCount++;
                        } catch (\PHPMailer\PHPMailer\Exception $e) {
                            $failureCount++;
                            error_log("Notification failed for {$targetEmail}: " . $mail->ErrorInfo);
                        }
                    }

                    error_log("Notification system: Sent {$successCount} alert(s) successfully. Failures: {$failureCount}");
                } else {
                    error_log('Notification system: No valid recipients found to notify.');
                }
            }
        }
    } catch (Exception $e) {
        error_log('Notification system unexpected error: ' . $e->getMessage());
    }

    $response_message = 'Message submitted successfully.';
    if ($uploaded_files > 0) {
        $response_message .= " {$uploaded_files} file(s) uploaded.";
    }
    if ($skipped_files > 0) {
        $response_message .= " {$skipped_files} file(s) were skipped due to validation errors.";
    }

    $response = [
        'success' => true,
        'message' => $response_message,
        'message_id' => $message_id,
        'files_uploaded' => $uploaded_files,
        'files_skipped' => $skipped_files
    ];

    if (!empty($file_errors)) {
        $response['file_errors'] = $file_errors;
    }

    echo json_encode($response);
} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    error_log('Project message submission error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to submit message. Please try again.']);
} finally {
    $conn = null;
}
