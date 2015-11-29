<?php

    namespace App;

    use Carbon\Carbon;
    use Illuminate\Database\Eloquent\Model;

    /**
 * App\Occurrence
 *
 * @property integer $id
 * @property \Carbon\Carbon $day
 * @property \Carbon\Carbon $from
 * @property \Carbon\Carbon $to
 * @property integer $cour_id
 * @property integer $classe_id
 * @property integer $school_id
 * @property integer $user_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \App\School $schools
 * @property-read \App\Classe $classes
 * @property-read \App\User $user
 * @method static \Illuminate\Database\Query\Builder|\App\Occurrence whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Occurrence whereDay($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Occurrence whereFrom($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Occurrence whereTo($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Occurrence whereCourId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Occurrence whereClasseId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Occurrence whereSchoolId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Occurrence whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Occurrence whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Occurrence whereUpdatedAt($value)
 */
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
            return $this->belongsTo('App\Classe');
        }
        public function user()
        {
            return $this->belongsTo('App\User');
        }

    }
