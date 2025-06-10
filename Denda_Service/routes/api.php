<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DendaController;

Route::prefix('/')->group(function () {
    Route::apiResource('denda', DendaController::class);
});
