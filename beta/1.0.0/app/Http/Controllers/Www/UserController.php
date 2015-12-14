<?php

    namespace App\Http\Controllers\Www;

    use App\Cour;
    use App\Occurrence;
    use App\School;
    use App\User;
    use Carbon\Carbon;
    use Illuminate\Http\Request;

    use App\Http\Requests;
    use App\Http\Controllers\Controller;
    use Illuminate\Support\Facades\Redirect;

    class UserController extends Controller
    {

        protected function postAvatar($id, Request $request)
        {
            $user = User::findBySlugOrIdOrFail($id);
            $file = $request->file('avatar');
            $name = 'user-avatars/'.$user->slug . '.' . $file->getClientOriginalExtension();
            \Storage::put(
                $name,
                file_get_contents($request->file('avatar')->getRealPath())
            );
            $user->avatar = $name;
            $user->save();
        }

        /**
         * Display a listing of the resource.
         *
         * @return \Illuminate\Http\Response
         */
        public function index()
        {
            $schools = \Auth::user()->schools;

            return view('teacher.teachers_index')->with(compact('schools'));
        }

        /**
         * Show the form for creating a new resource.
         *
         * @return \Illuminate\Http\Response
         */
        public function create()
        {
            //
        }

        /**
         * Store a newly created resource in storage.
         *
         * @param  \Illuminate\Http\Request $request
         *
         * @return \Illuminate\Http\Response
         */
        public function store(Request $request)
        {
            //
        }

        /**
         * Display the specified resource.
         *
         * @param  string $slug_user $slug_school
         *
         * @return \Illuminate\Http\Response
         */
        public function show($school_slug, $user_slug)
        {
            $user = School::findBySlugOrFail($school_slug)->users()->where('slug', '=', $user_slug)->firstOrFail();

            return view('teacher.show', compact('user'));
        }

        /**
         * Show the form for editing the specified resource.
         *
         * @param  int $id
         *
         * @return \Illuminate\Http\Response
         */
        public function edit($id)
        {
            //
        }

        /**
         * Update the specified resource in storage.
         *
         * @param  \Illuminate\Http\Request $request
         * @param  int                      $id
         *
         * @return \Illuminate\Http\Response
         */
        public function update(Requests\UpdateUserProfilRequest $request, $id)
        {
            $user = User::findBySlugOrIdOrFail($id);
            $user->update($request->all());
            $this->postAvatar($id, $request);

            \Flash::success('Votre profile à été mis à jour avec succès');

            return redirect()->action('Www\PageController@dashboard');
        }

        /**
         * Remove the specified resource from storage.
         *
         * @param  int $id
         *
         * @return \Illuminate\Http\Response
         */
        public function destroy($id)
        {
            //
        }

        public function addUserToSchool($id)
        {
            if (!\Auth::user()->schools->contains($id)) {
                \Auth::user()->schools()->attach($id);
                Flash::success('Votre demande d’adhésion est en cours de traitement.');
            } else {
                Flash::error('Vous appartenez déjà à cette école');
            }

            return \Redirect::back();
        }

        public function getConfig()
        {
            return view('teacher.edit')->with('user', \Auth::user());
        }

    }
