# Reproducible security patches

http-cache-semantics 4.3.0 still reproduces GHSA-ch52-4w7c-c8xp despite the advisory currently listing versions through 4.2.0. The retained patch prevents client max-stale from overriding non-storable, no-cache, protected shared Set-Cookie, Vary-star or proxy-revalidate entries. Tests also preserve normal public/private caching and eligible stale reuse.

Normal dependency installation applies the committed patches through `postinstall`. Installations using `--ignore-scripts` must run `npm run postinstall` before build/start. Patch failures stop installation. The patch hook skips absent target packages (for example when omitted development dependencies do not install the middleware).

Run `npm run test:security` to check the regression and ordinary behavior. Keep package versions and patch files synchronized when upgrading. These changes do not dismiss alerts or change workflow/security permissions.
