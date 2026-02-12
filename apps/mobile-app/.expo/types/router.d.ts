/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(app)'}/home` | `/home`; params?: Router.UnknownInputParams; } | { pathname: `${'/(app)'}/profile` | `/profile`; params?: Router.UnknownInputParams; } | { pathname: `${'/(app)'}/search` | `/search`; params?: Router.UnknownInputParams; } | { pathname: `${'/(app)'}/social` | `/social`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(app)'}/home` | `/home`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(app)'}/profile` | `/profile`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(app)'}/search` | `/search`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(app)'}/social` | `/social`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(app)'}/home${`?${string}` | `#${string}` | ''}` | `/home${`?${string}` | `#${string}` | ''}` | `${'/(app)'}/profile${`?${string}` | `#${string}` | ''}` | `/profile${`?${string}` | `#${string}` | ''}` | `${'/(app)'}/search${`?${string}` | `#${string}` | ''}` | `/search${`?${string}` | `#${string}` | ''}` | `${'/(app)'}/social${`?${string}` | `#${string}` | ''}` | `/social${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(app)'}/home` | `/home`; params?: Router.UnknownInputParams; } | { pathname: `${'/(app)'}/profile` | `/profile`; params?: Router.UnknownInputParams; } | { pathname: `${'/(app)'}/search` | `/search`; params?: Router.UnknownInputParams; } | { pathname: `${'/(app)'}/social` | `/social`; params?: Router.UnknownInputParams; };
    }
  }
}
