<?php

namespace App\Mail;

use App\Models\Sale;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;

class SaleInvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public Sale $sale;

    /**
     * Create a new message instance.
     */
    public function __construct(Sale $sale)
    {
        $this->sale = $sale;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Invoice ' . $this->sale->invoice_number . ' from ' . config('app.name'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.sale-invoice',
            with: [
                'sale' => $this->sale,
                'customer' => $this->sale->customer,
                'items' => $this->sale->items,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        // Generate PDF
        $pdf = Pdf::loadView('pdfs.sale-invoice', [
            'sale' => $this->sale,
            'customer' => $this->sale->customer,
            'items' => $this->sale->items,
        ]);

        return [
            Attachment::fromData(fn () => $pdf->output(), 'invoice-' . $this->sale->invoice_number . '.pdf')
                ->withMime('application/pdf'),
        ];
    }
}
