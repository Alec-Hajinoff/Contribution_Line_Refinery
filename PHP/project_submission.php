<?php

require_once 'session_config.php';

require_once __DIR__ . '/../vendor/autoload.php';

if (! isset($_SESSION['id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['success' => false, 'message' => 'You must be logged in to submit a project.']);
    exit;
}

$user_id = $_SESSION['id'];

$allowed_origins = [
    'http://localhost:3000',
    'https://hertfordstandard.com',
    'https://www.hertfordstandard.com',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? null;

if ($origin !== null && in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif ($origin === null) {
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

if (! isset($_POST['title']) || empty(trim($_POST['title']))) {
    echo json_encode(['success' => false, 'message' => 'Project title is required.']);
    exit;
}

if (! isset($_POST['description']) || empty(trim($_POST['description']))) {
    echo json_encode(['success' => false, 'message' => 'Project description is required.']);
    exit;
}

$title       = trim($_POST['title']);
$description = trim($_POST['description']);

$allowed_types = ['image/png', 'image/jpeg', 'application/pdf'];
$max_file_size = 10 * 1024 * 1024;
$max_files     = 5;

$servername     = 'localhost';
$username       = 'hertford_standard_user';
$passwordServer = 'T6hhZ2Lz3UQbXBK';
$dbname         = 'hertford_standard';
$port           = 3306;

try {
    $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $passwordServer);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    error_log('Database connection failed: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server configuration error.']);
    exit;
}

try {
    $conn->beginTransaction();

    $sql = 'INSERT INTO projects (user_id, title, description, status, created_at, updated_at)
            VALUES (:user_id, :title, :description, :status, NOW(), NOW())';

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':user_id'     => $user_id,
        ':title'       => $title,
        ':description' => $description,
        ':status'      => 'in_progress',
    ]);

    $project_id = $conn->lastInsertId();

    $uploaded_files = 0;
    $skipped_files  = 0;
    $file_errors    = [];

    if (isset($_FILES['attachments']) && ! empty($_FILES['attachments']['name'][0])) {
        $files      = $_FILES['attachments'];
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
            $file_tmp  = $files['tmp_name'][$i];

            if (! in_array($file_type, $allowed_types)) {
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

            $sql_attachment = 'INSERT INTO project_attachments
                              (project_id, attachment, attachment_name, attachment_type, uploaded_by, uploaded_at)
                              VALUES (:project_id, :attachment, :attachment_name, :attachment_type, :uploaded_by, NOW())';

            $stmt_attachment = $conn->prepare($sql_attachment);
            $stmt_attachment->bindParam(':project_id', $project_id, PDO::PARAM_INT);
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
        $adminSql  = 'SELECT email, name FROM users WHERE is_admin = 1 AND is_verified = 1';
        $adminStmt = $conn->prepare($adminSql);
        $adminStmt->execute();
        $adminUsers = $adminStmt->fetchAll(PDO::FETCH_ASSOC);

        if (! empty($adminUsers)) {
            $userSql  = 'SELECT name, email FROM users WHERE id = :user_id';
            $userStmt = $conn->prepare($userSql);
            $userStmt->execute([':user_id' => $user_id]);
            $submittingUser = $userStmt->fetch(PDO::FETCH_ASSOC);

            $urlLink = 'https://hertfordstandard.com';
            $subject = 'New Project Submission - Hertford Standard';

            $emailBody  = "A new project has been submitted to Hertford Standard.\n\n";
            $emailBody .= 'Project Title: ' . $title . "\n";
            $emailBody .= 'Project ID: ' . $project_id . "\n\n";
            $emailBody .= 'Submitted by: ' . ($submittingUser['name'] ?? 'Unknown') . "\n";
            $emailBody .= "Submitter's Email: " . ($submittingUser['email'] ?? 'Unknown') . "\n\n";
            $emailBody .= "Please log in to the admin dashboard to review this project " . $urlLink;

            $successCount = 0;
            $failureCount = 0;

            foreach ($adminUsers as $admin) {
                $adminEmail = $admin['email'];
                $adminName  = $admin['name'];

                if (empty($adminEmail) || ! filter_var($adminEmail, FILTER_VALIDATE_EMAIL)) {
                    error_log("Admin notification: Invalid admin email address for user: {$adminName}");
                    $failureCount++;
                    continue;
                }

                $mail = new PHPMailer\PHPMailer\PHPMailer(true);

                try {
                    $mail->SMTPDebug = PHPMailer\PHPMailer\SMTP::DEBUG_OFF;
                    $mail->isSMTP();
                    $mail->Host       = 'localhost';
                    $mail->SMTPAuth   = false;
                    $mail->SMTPSecure = false;
                    $mail->Port       = 25;

                    $mail->setFrom('alec@hertfordstandard.com', 'Hertford Standard');
                    $mail->addAddress($adminEmail, $adminName);

                    $mail->isHTML(false);
                    $mail->Subject = $subject;
                    $mail->Body    = $emailBody;

                    $mail->send();
                    $successCount++;
                } catch (PHPMailer\PHPMailer\Exception $e) {
                    $failureCount++;
                    error_log("Admin notification failed for {$adminEmail}: " . $mail->ErrorInfo);
                }
            }

            if ($successCount > 0) {
                error_log("Admin notification: Sent {$successCount} new project alert(s) successfully. Failures: {$failureCount}");
            } else {
                error_log("Admin notification: Failed to send any admin notifications. All {$failureCount} attempts failed.");
            }
        } else {
            error_log('Admin notification: No admin users found in database to notify about new project submission');
        }
    } catch (Exception $e) {
        error_log('Admin notification unexpected error: ' . $e->getMessage());
    }

    $response_message = "Project '{$title}' submitted successfully.";
    if ($uploaded_files > 0) {
        $response_message .= " {$uploaded_files} file(s) uploaded.";
    }
    if ($skipped_files > 0) {
        $response_message .= " {$skipped_files} file(s) were skipped due to validation errors.";
    }

    $response = [
        'success'        => true,
        'message'        => $response_message,
        'project_id'     => $project_id,
        'files_uploaded' => $uploaded_files,
        'files_skipped'  => $skipped_files,
    ];

    if (! empty($file_errors)) {
        $response['file_errors'] = $file_errors;
    }

    echo json_encode($response);
} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }

    error_log('Project submission error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to submit project. Please try again.']);
} finally {
    $conn = null;
}
