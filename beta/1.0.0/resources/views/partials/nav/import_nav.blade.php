<ol class="create-pagination">
    <li class="create-pagination__item {{ Request::is('student-import') ? 'create-pagination__item--active' : '' }}">
        <a href="{!! URL::action('Www\StudentController@getImportStudentsList') !!}" class="">Choisir un fichier</a>
    </li>
    <li class="create-pagination__item {{ Request::is('get-valide-student-importe') ? 'create-pagination__item--active' : '' }}">
        @if(isset($studentImport))
            <a href="{!! URL::action('Www\StudentController@getImportStudentsList') !!}" class="">Valider
                l’importation</a>
        @else
            <span>Valider l’importation</span>
        @endif
    </li>
</ol>