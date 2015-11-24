<?php

    namespace App;

    use Illuminate\Database\Eloquent\Model;
    use Illuminate\Support\Str;

    /**
 * App\Student
 *
 * @property integer $id
 * @property string $first_name
 * @property string $last_name
 * @property string $slug
 * @property string $email_parent_1
 * @property string $email_parent_2
 * @property string $email_eleve_1
 * @property string $email_eleve_2
 * @property string $photo
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property integer $school_id
 * @property integer $classe_id
 * @property-read \App\School $school
 * @property-read \App\Classes $classe
 * @method static \Illuminate\Database\Query\Builder|\App\Student whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Student whereFirstName($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Student whereLastName($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Student whereSlug($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Student whereEmailParent1($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Student whereEmailParent2($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Student whereEmailEleve1($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Student whereEmailEleve2($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Student wherePhoto($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Student whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Student whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Student whereSchoolId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Student whereClasseId($value)
 */
class Student extends Model
    {
        /**
         * The database table used by the model.
         *
         * @var string
         */
        protected $table = 'students';

        /**
         * The attributes that are mass assignable.
         *
         * @var array
         */
        protected $fillable = [
            'first_name',
            'last_name',
            'slug',
            'email_parent_1',
            'email_parent_2',
            'email_eleve_1',
            'email_eleve_2',
            'classe_id',
            'school_id',
            'photo'
        ];

        /**
         * Create a slug when user is create
         *
         * @param $value
         */
        public function setFirstNameAttribute($value)
        {
            $slug = Str::slug($value);
            if (count(User::where('slug', '=', $slug)->get())) {
                if ($this->slug) {
                    $slug = $this->slug;
                } else {
                    $slug .= '-' . (\DB::table('students')->max('id') + 1);
                }
            }
            $this->attributes['slug'] = $slug;
            $this->attributes['first_name'] = $value;
        }

        public function school()
        {
            return $this->belongsTo('App\School');
        }

        public function classe()
        {
            return $this->belongsTo('App\Classes');
        }
    }
