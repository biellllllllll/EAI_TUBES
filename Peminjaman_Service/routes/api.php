<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PeminjamanController; // Import Controller


Route::prefix('/')->group(function () {
    Route::apiResource('peminjaman', PeminjamanController::class);
});
