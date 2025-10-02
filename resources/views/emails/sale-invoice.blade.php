<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $sale->invoice_number }}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Invoice {{ $sale->invoice_number }}</h2>
        
        <p>Dear {{ $customer->name }},</p>
        
        <p>Thank you for your business! Please find attached your invoice for the recent purchase.</p>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Invoice Summary</h3>
            <table style="width: 100%;">
                <tr>
                    <td><strong>Invoice Number:</strong></td>
                    <td>{{ $sale->invoice_number }}</td>
                </tr>
                <tr>
                    <td><strong>Invoice Date:</strong></td>
                    <td>{{ $sale->sale_date->format('F d, Y') }}</td>
                </tr>
                <tr>
                    <td><strong>Total Amount:</strong></td>
                    <td><strong style="font-size: 18px; color: #2563eb;">${{ number_format($sale->total_amount, 2) }}</strong></td>
                </tr>
                <tr>
                    <td><strong>Payment Status:</strong></td>
                    <td>{{ ucfirst($sale->payment_status) }}</td>
                </tr>
            </table>
        </div>
        
        <p>The detailed invoice is attached as a PDF file to this email.</p>
        
        <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br>
            <strong>{{ config('app.name') }}</strong>
        </p>
    </div>
</body>
</html>

