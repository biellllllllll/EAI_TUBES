<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BukuController;


Route::prefix('/')->group(function () {
    Route::apiResource('buku', BukuController::class);
});
