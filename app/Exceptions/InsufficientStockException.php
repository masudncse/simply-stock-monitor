<?php

namespace App\Exceptions;

use Exception;

class InsufficientStockException extends Exception
{
    protected $productId;
    protected $productName;
    protected $requestedQuantity;
    protected $availableQuantity;

    public function __construct($productId, $productName = null, $requestedQuantity = null, $availableQuantity = null)
    {
        $this->productId = $productId;
        $this->productName = $productName;
        $this->requestedQuantity = $requestedQuantity;
        $this->availableQuantity = $availableQuantity;

        $message = "Insufficient stock for product";
        if ($productName) {
            $message .= " '{$productName}'";
        }
        if ($requestedQuantity !== null && $availableQuantity !== null) {
            $message .= ". Requested: {$requestedQuantity}, Available: {$availableQuantity}";
        }

        parent::__construct($message);
    }

    public function getProductId()
    {
        return $this->productId;
    }

    public function getProductName()
    {
        return $this->productName;
    }

    public function getRequestedQuantity()
    {
        return $this->requestedQuantity;
    }

    public function getAvailableQuantity()
    {
        return $this->availableQuantity;
    }
}
