# Pitch Perfect — Architecture

This diagram is based on the repository's current `package.json`, Next.js root layout, tRPC router registry, environment schema, and Drizzle schema. It distinguishes application components from external services.

## System architecture

```mermaid
flowchart TB
    customer["Customer / mobile browser"]
    manager["Admin / staff browser"]

    subgraph client["Next.js 15 application — React 19 / TypeScript"]
      ui["App Router pages and UI components"]
      state["Client providers and state\nTanStack Query · tRPC React\nbooking / phone / language / theme"]
      analyticsClient["PostHog browser analytics"]
      pwa["PWA registration"]
    end

    subgraph server["Next.js server"]
      routes["App Router pages and route handlers"]
      api["tRPC API"]
      routers["Application routers\nbooking · timeSlot · customer\ngallery · banner · admin · superAdmin"]
      auth["Better Auth\nsessions and account authentication"]
      dbLayer["Drizzle ORM / PostgreSQL driver"]
      jobs["Scheduled or server-side handlers\n(where configured)"]
    end

    subgraph data["PostgreSQL database"]
      authTables["Auth tables\nuser · session · account · verification"]
      appTables["Application tables\nmanager · customer · time_slot · booking"]
      contentTables["Content and operations\ngallery · banner · coupon · coupon_use\nmanager_log · config"]
    end

    subgraph external["External services"]
      cloudinary["Cloudinary\nimage / video media"]
      paytm["Paytm\npayment configuration and checksum library"]
      resend["Resend\ntransactional email"]
      ntfy["ntfy\nnotification topic"]
      posthog["PostHog\nproduct analytics"]
    end

    customer --> ui
    manager --> ui
    ui --> state
    ui --> routes
    state --> api
    api --> routers
    routes --> auth
    routers --> auth
    routers --> dbLayer
    auth --> dbLayer
    dbLayer --> authTables
    dbLayer --> appTables
    dbLayer --> contentTables

    routers --> cloudinary
    routes -. "payment flow, where invoked" .-> paytm
    routes -. "email flows, where invoked" .-> resend
    routes -. "notifications, where invoked" .-> ntfy
    analyticsClient --> posthog
    pwa -. "service-worker registration" .-> ui
    jobs -. "server-side tasks, if enabled" .-> dbLayer

    classDef browser fill:#e8f2ff,stroke:#3674b5,color:#102a43
    classDef backend fill:#e9f7ef,stroke:#31845b,color:#153b2b
    classDef database fill:#fff2d9,stroke:#b7791f,color:#55350b
    classDef service fill:#f2eaff,stroke:#815ac0,color:#332052
    class customer,manager,ui,state,analyticsClient,pwa browser
    class routes,api,routers,auth,dbLayer,jobs backend
    class authTables,appTables,contentTables database
    class cloudinary,paytm,resend,ntfy,posthog service
```

## Request and data flow

1. The customer or staff member opens the responsive Next.js application.
2. Client components use the tRPC React integration and TanStack Query for typed API calls and client-side query caching.
3. The tRPC root router dispatches requests to the registered booking, time-slot, customer, gallery, banner, admin, super-admin, and post routers.
4. Server-side business logic uses Drizzle ORM and the PostgreSQL driver to access the database. Better Auth provides authentication/session handling and stores its auth records in PostgreSQL.
5. Media records reference Cloudinary assets. The repository also configures Paytm, Resend, ntfy, and PostHog integration settings/libraries; the exact runtime call paths should be verified in their respective implementation files before treating every integration as active in every flow.

## Verified implementation details

- **Web framework:** Next.js 15 App Router, React 19, TypeScript.
- **API:** tRPC v11 with TanStack Query and SuperJSON.
- **Database:** PostgreSQL through `postgres` and Drizzle ORM.
- **Authentication:** Better Auth; auth schema includes `user`, `session`, `account`, and `verification`.
- **Booking domain:** customer, time slot, booking, coupon, coupon use, configuration, manager, gallery, banner, and manager log tables are defined in `src/server/db/schema.ts`.
- **Media and observability:** Cloudinary and PostHog are configured.
- **Operational integrations:** environment validation includes Paytm, Resend, and ntfy configuration.

## Source files

- [Application router registry](../src/server/api/root.ts)
- [Database schema](../src/server/db/schema.ts)
- [Environment configuration](../src/env.js)
- [Root application layout and providers](../src/app/layout.tsx)
- [Dependencies and scripts](../package.json)

> **Accuracy note:** This is a repository-derived logical architecture, not a deployment topology. It does not assert a separate microservice, queue, or worker. External-service arrows marked “where invoked” indicate configured integrations, not proof that every flow is currently enabled in production.
