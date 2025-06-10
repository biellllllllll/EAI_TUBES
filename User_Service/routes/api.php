<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PengunjungController;

Route::prefix('/')->group(function () {
    Route::apiResource('pengunjung', PengunjungController::class);
});
