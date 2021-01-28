Simple spatial navigation algorithms for React based projects.

## Available Scripts
### `yarn yalc-push`

Pushes changes to link consumers. Use when developing locally to push changes.
No manual build is needed.

### `yarn watch`
Does above automatically, on each file save under src/ directory.


### `yarn start`

Runs example app on http://localhost:3000


## Testing locally
- Install `yalc` package globally
- `yarn yalc-push` to push changes from this repo to local 'yalc' repo
- Run `yalc add react-native-focus-kit` in consumer-repo to fetch changes

## Why yalc
React-native's standard bundler "Metro" does not follow symlinks.
See: https://github.com/facebook/metro/issues/1

Changes must be pushed manually then... (as in `mv source target`)
Yalc makes above easier.
