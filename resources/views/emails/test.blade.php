<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $testType }} - {{ $appName }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .success {
            color: #28a745;
            font-weight: bold;
        }
        .info {
            background-color: #e7f3ff;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            color: #6c757d;
            font-size: 14px;
            margin-top: 20px;
        }
        .timestamp {
            color: #6c757d;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $testType }}</h1>
        <p class="timestamp">Sent at: {{ $timestamp }}</p>
    </div>

    <div class="content">
        <h2 class="success">✅ Email Configuration Test Successful!</h2>
        
        <p>This is a test email from <strong>{{ $appName }}</strong> to verify that your SMTP email configuration is working correctly.</p>

        <div class="info">
            <h3>Test Details:</h3>
            <ul>
                <li><strong>Test Type:</strong> {{ $testType }}</li>
                <li><strong>Application:</strong> {{ $appName }}</li>
                <li><strong>Timestamp:</strong> {{ $timestamp }}</li>
                <li><strong>Status:</strong> <span class="success">Success</span></li>
            </ul>
        </div>

        <p>If you received this email, your email configuration is working properly and you can now send emails from your application.</p>

        <p><strong>Next Steps:</strong></p>
        <ul>
            <li>Configure notification emails for system alerts</li>
            <li>Set up user registration emails</li>
            <li>Configure password reset emails</li>
            <li>Set up automated reports and notifications</li>
        </ul>
    </div>

    <div class="footer">
        <p>This is an automated test email from {{ $appName }}</p>
        <p>If you did not request this test, please ignore this email.</p>
    </div>
</body>
</html>
