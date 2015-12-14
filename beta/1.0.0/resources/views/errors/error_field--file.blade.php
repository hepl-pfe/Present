@if(!empty($errors->get($field)))
    <ul class="error-field">
        @foreach($errors->get($field) as $error )
            <li class="alert-danger message-box">{!! $error !!}</li>
        @endforeach
    </ul>
@endif