        return User::where('slug', '=', $slug)->firstOrFail();
