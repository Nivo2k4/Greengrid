import userRepository from "../repository/userRepository.js";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from 'passport-local';
import passport from "passport";

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await userRepository.FindByEmail(email);
        if (!user || !user.password) return done(null, false, { message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: 'Invalid credentials' });

        done(null, user);
    } catch (err) {
        done(err);
    }
}));