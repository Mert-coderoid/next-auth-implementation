import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const options = {
    providers: [
        GitHubProvider({
            profile(profile) {
                console.log("GitHub profile", profile);
                let userRole = "GitHub User";
                if (profile.login === "yilmazmert1501@gmail.com") {
                    userRole = "admin"; 
                }
                
                return {
                    ...profile,
                    name: profile.name,
                    email: profile.email,
                    image: profile.avatar_url,
                    role: userRole
                };
            },
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        GoogleProvider({
            profile(profile) {
                console.log("Google profile", profile);
                return {
                    ...profile,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: userRole
                };
            },
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },

        async session ({session, token}) {
            if (session?.user) session.user.role = token.role;
            return session;
        }
    }
};