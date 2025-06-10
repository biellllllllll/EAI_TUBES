<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PengembalianController;

Route::prefix('/')->group(function () {
    Route::apiResource('pengembalian', PengembalianController::class);
});
