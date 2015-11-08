<input type="hidden" name="_token" value="{{ csrf_token() }}">

<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
        {!! Form::label('name','Votre prénom',['class'=>'floating-placeholder--label floating-placeholder--label--blue']) !!}
        <input type="text" class="form-control" name="name" value="{{ old('name') }}">
</div>

<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('email','Votre adresse email',['class'=>'floating-placeholder--label floating-placeholder--label--blue']) !!}
        <input type="email" class="form-control" name="email" value="{{ old('email') }}">
</div>

<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    <label class="">Password</label>
    <input type="password" class="form-control" name="password">
</div>

<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    <label class="">Confirm Password</label>
        <input type="password" class="form-control" name="password_confirmation">
</div>

<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    <div class="col-md-6 col-md-offset-4">
        <button type="submit" class="btn btn-primary">
            Register
        </button>
    </div>
</div>