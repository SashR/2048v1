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
        ]);
        $checkIp = Score::where('ip', $req->ip())->first();
        if(isset($checkIp)) $name = $checkIp->name;
        else {
            do {
                $name = bin2hex(random_bytes(7));
                $checkName = Score::where('name', $name)->first();
            } while(is_null($checkName));
        }

        Score::insert([
            'score' => $v['score'],
            'moves' => $v['moves'],
            'name'  => $name,
            'ip'    => $req->ip()
        ]);
    }
}
