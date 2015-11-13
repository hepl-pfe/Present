@if(!empty($errors->get($field)))
    <ul class="error-message-container">
        @foreach($errors->get($field) as $error )
            <li class="error-message-container__message">{!! $error !!}</li>
        @endforeach
    </ul>
@endif