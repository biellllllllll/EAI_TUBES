<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::dropIfExists('denda');
    }

    public function down()
    {
        // No need to recreate in down() since the create_denda_table migration will handle that
    }
}; 