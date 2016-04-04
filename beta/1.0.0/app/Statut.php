<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Statut extends Model
{
    protected $table = 'statuts';
    protected $fillable = [
        'name',
        'color'
    ];
    public function presents()
    {
        $this->hasMany('\App\Present');
    }
    public function user()
    {
        $this->belongsTo('\App\User');
    }

}
