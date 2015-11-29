<?php

    namespace App;

    use Illuminate\Database\Eloquent\Model;
    use Cviebrock\EloquentSluggable\SluggableInterface;
    use Cviebrock\EloquentSluggable\SluggableTrait;

    /**
     * App\Student
     *
     * @property integer           $id
     * @property string            $first_name
     * @property string            $last_name
     * @property string            $slug
     * @property string            $email_parent_1
     * @property string            $email_parent_2
     * @property string            $email_eleve_1
     * @property string            $email_eleve_2
     * @property string            $photo
     * @property \Carbon\Carbon    $created_at
     * @property \Carbon\Carbon    $updated_at
     * @property integer           $school_id
     * @property integer           $classe_id
     * @property-read \App\School  $school
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
    class Student extends Model implements SluggableInterface
    {

        use SluggableTrait;

        protected $sluggable = [
            'build_from' => 'fullname',
            'save_to'    => 'slug',
        ];
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
            'school_id',
            'photo'
        ];

        public function getFullnameAttribute() {
            return $this->first_name . ' ' . $this->last_name;
        }

        public function school()
        {
            return $this->belongsTo('App\School');
        }

        public function user()
        {
            return $this->belongsTo('App\User');

        }

        public function classes()
        {
            return $this->belongsToMany('App\Classe');
        }

        public function presences()
        {
            return $this->hasMany('App\Present');
        }

        public function notes()
        {
            return $this->hasMany('App\Note');
        }
    }
