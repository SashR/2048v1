<?php

namespace App\Http\Controllers;

use App\Models\Score;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    public function record(Request $req){
        $v = $req->validate([
            'score' => 'required|integer|min:0',
            'moves' => 'required|integer|min:0',
            'name'  => 'required|string|min:5'
        ]);

        Score::insert([
            'score' => $v['score'],
            'moves' => $v['moves'],
            'name'  => $v['name']
        ]);
    }
}
