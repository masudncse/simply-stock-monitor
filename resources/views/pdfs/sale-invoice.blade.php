<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $sale->invoice_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
        }
        .invoice-title {
            font-size: 20px;
            margin-top: 10px;
        }
        .details-section {
            margin: 20px 0;
        }
        .details-table {
            width: 100%;
            margin-bottom: 20px;
        }
        .details-table td {
            padding: 5px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .items-table th {
            background: #2563eb;
            color: white;
            padding: 10px;
            text-align: left;
        }
        .items-table td {
            padding: 8px;
            border-bottom: 1px solid #e5e7eb;
        }
        .text-right {
            text-align: right;
        }
        .totals {
            float: right;
            width: 300px;
            margin-top: 20px;
        }
        .totals table {
            width: 100%;
        }
        .totals td {
            padding: 5px;
        }
        .total-row {
            font-weight: bold;
            font-size: 14px;
            border-top: 2px solid #333;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">{{ config('app.name') }}</div>
        <div class="invoice-title">INVOICE</div>
        <div>{{ $sale->invoice_number }}</div>
    </div>

    <table class="details-table">
        <tr>
            <td style="width: 50%; vertical-align: top;">
                <strong>Bill To:</strong><br>
                {{ $customer->name }}<br>
                @if($customer->address)
                    {{ $customer->address }}<br>
                @endif
                @if($customer->phone)
                    Phone: {{ $customer->phone }}<br>
                @endif
                @if($customer->email)
                    Email: {{ $customer->email }}
                @endif
            </td>
            <td style="width: 50%; vertical-align: top; text-align: right;">
                <strong>Invoice Date:</strong> {{ $sale->sale_date->format('F d, Y') }}<br>
                <strong>Status:</strong> {{ ucfirst($sale->status) }}<br>
                <strong>Payment Status:</strong> {{ ucfirst($sale->payment_status) }}
            </td>
        </tr>
    </table>

    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 40%;">Product</th>
                <th style="width: 15%;">SKU</th>
                <th style="width: 10%; text-align: center;">Quantity</th>
                <th style="width: 15%; text-align: right;">Unit Price</th>
                <th style="width: 15%; text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $item->product->name }}</td>
                <td>{{ $item->product->sku }}</td>
                <td style="text-align: center;">{{ $item->quantity }}</td>
                <td class="text-right">${{ number_format($item->unit_price, 2) }}</td>
                <td class="text-right">${{ number_format($item->total_price, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <table>
            <tr>
                <td>Subtotal:</td>
                <td class="text-right">${{ number_format($sale->subtotal, 2) }}</td>
            </tr>
            @if($sale->tax_amount > 0)
            <tr>
                <td>Tax:</td>
                <td class="text-right">${{ number_format($sale->tax_amount, 2) }}</td>
            </tr>
            @endif
            @if($sale->discount_amount > 0)
            <tr>
                <td>Discount:</td>
                <td class="text-right">-${{ number_format($sale->discount_amount, 2) }}</td>
            </tr>
            @endif
            <tr class="total-row">
                <td>Total Amount:</td>
                <td class="text-right">${{ number_format($sale->total_amount, 2) }}</td>
            </tr>
            <tr>
                <td>Paid Amount:</td>
                <td class="text-right">${{ number_format($sale->paid_amount, 2) }}</td>
            </tr>
            <tr style="font-weight: bold; color: #dc2626;">
                <td>Amount Due:</td>
                <td class="text-right">${{ number_format($sale->total_amount - $sale->paid_amount, 2) }}</td>
            </tr>
        </table>
    </div>

    <div style="clear: both;"></div>

    @if($sale->notes)
    <div style="margin-top: 30px;">
        <strong>Notes:</strong><br>
        {{ $sale->notes }}
    </div>
    @endif

    <div class="footer">
        <p>Thank you for your business!</p>
        <p>This is a computer-generated invoice.</p>
    </div>
</body>
</html>

