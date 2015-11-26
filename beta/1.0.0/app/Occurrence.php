<?php

    namespace App;

    use Carbon\Carbon;
    use Illuminate\Database\Eloquent\Model;

    class Occurrence extends Model
    {
        /**
         * The database table used by the model.
         *
         * @var string
         */
        protected $table = 'occurrences';

        /**
         * The attributes that are mass assignable.
         *
         * @var array
         */
        protected $fillable = ['cour_id', 'school_id', 'classe_id', 'from', 'to'];
        protected $dates = ['day','from','to'];

        public function setFromAttribute($value)
        {
            $time=explode(':',$value);
            $this->attributes['from'] = Carbon::createFromTime($this[0],$time[1]);
        }
        public function setToAttribute($value)
        {
            $time=explode(':',$value);
            $this->attributes['to'] = Carbon::createFromTime($this[0],$time[1]);
        }

        public function schools()
        {
            return $this->belongsTo('App\School');
        }

        public function classes()
        {
            return $this->belongsTo('App\Classes');
        }

    }
