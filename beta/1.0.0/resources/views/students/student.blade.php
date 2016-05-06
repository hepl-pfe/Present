@extends('layouts.teacher_layout')
@section('title', $student->fullname)
@section('teacher_content')
    <div class="media section">
        <img src="{!! asset('img/default_profile_picture.jpg') !!}" alt=""
             class="media__img user-image user-image--medium">
        <dl class="media-body">
            <dt>Appartient à la classe :</dt>
            <dd>
                @foreach($student->classes as $class)
                    {!! Html::linkAction('Www\ClassController@show',$class->name,['classe_slug'=>$class->slug]) !!}
                @endforeach</dd>
            <dt>Ses cours :</dt>
            <dd>
                @foreach($student->classes as $classe)
                    @foreach($classe->cours as $cour)
                        {!! Html::linkAction('Www\CoursController@show',$cour->name,['cour_slug'=>$cour->slug]) !!}
                    @endforeach
                @endforeach</dd>
        </dl>
    </div>
    @if($student->presences->count()>1)
        <?php $iTotalSeances = 0;
        $statusTable = [];
        ?>
        @foreach($student->presences as $present)
            <?php ++$iTotalSeances; ?>
            <?php
            if (array_key_exists($present->statut->id, $statusTable)) {
                $statusTable[ $present->statut->id ]['nbr'] += 1;
            } else {
                $statusTable[ $present->statut->id ]['nbr'] = 1;
                $statusTable[ $present->statut->id ]['color'] = $present->statut->color;
                $statusTable[ $present->statut->id ]['name'] = $present->statut->name;
            }
            ?>
        @endforeach
        <p>Sur {{ $iTotalSeances }} séances,
            <?php $i = 1; ?>
            @foreach($statusTable as $statut)
                {{$statut['nbr']}} <i>{{$statut['name']}}</i>{{ $i<count($statusTable)?',':'' }}
                <?php $i++;?>
            @endforeach.</p>
        <div id="piechart-{{$student->id}}"
             <?php $ii = 0 ?>
             @foreach($statusTable as $statut)
             <?php $ii++; ?>
             data-present_{{$ii}}="{{$ii}},{{$statut['name']}},{{$statut['nbr']}},{{$statut['color']}}"
             @endforeach
             class="piechart-seances graphique-container"></div>
    @else
        <p>Cet élève n’a pas encore participé à un cours. {!!  Html::linkAction('Www\PresentController@getPlanificateFull','Planifier une séance de cours!') !!}</p>
    @endif
    <?php $iTotalCours = 0;
    $coursTable = [];
    ?>
    @foreach($student->presences as $present)
        dd(
    @endforeach

    <div class="section">
        {!! Form::open(['action'=>'Www\StudentController@storeNote']) !!}
        {!! Form::hidden('student_id',$student->id) !!}
        @include('forms.students.add_notes')
        {!! Form::close() !!}
    </div>
    @unless(empty($notes->toArray()))
        <div class="layout section">
            <div class="layout__item u-4/12 u-4/12-desk u-6/12-lap u-12/12-palm">
                <h2 class="header_note">Notes</h2>
                <ul class="list-block">
                    @foreach($notes as $note)
                        <li>{!! $note->note !!}</li>
                    @endforeach
                </ul>
            </div>
        </div>
    @endunless
    {!!  Form::open(['action' => ['Www\StudentController@destroy', $student->id], 'method' => 'delete','class'=>'inline']) !!}
    <button class="btn btn--alert btn--red-svg"
            data-toggle="tooltip" title="Supprimer l’élève : : {!! $student->fullname !!}">
        <svg class="svg-basic svg--white">
            <use xlink:href="#shape-trash"></use>
        </svg>
        <span>Supprimer l’élève : {!! $student->fullname !!}</span>
    </button>
@stop