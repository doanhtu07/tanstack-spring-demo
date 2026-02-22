# Liquibase Support

By default, this project uses Liquibase for managing database migrations

Here is the folder structure for Liquibase:

```
.
└── src
    └── main
        └── resources
            └── db
                └── changelog
                    ├── changelog-indexes
                    │   └── authority.yaml
                    ├── changelog-tables
                    │   ├── authority.yaml
                    │   └── user.yaml
                    ├── changelog-triggers
                    │   └── updated_at.yaml
                    └── changelog-root.yaml
```

## Explanation

- `changelog-root.yaml`: The root changelog file that includes all other changelog files. This is the file that
  Liquibase will use to apply migrations.
- `changelog-tables`: This folder contains changelog files for creating tables. Each file corresponds to a specific
  table (e.g., `user.yaml` for the `user` table).
- `changelog-indexes`: This folder contains changelog files for creating indexes. Each file corresponds to a specific
  table (e.g., `authority.yaml` for indexes related to the `authority` table).
- `changelog-triggers`: This folder contains changelog files for creating triggers. Each file corresponds to a specific
  trigger (e.g., `updated_at.yaml` for a trigger that updates the `updated_at` column).

## Best practices for repeatable migrations

- Tables/Indexes: Use `onFail: MARK_RAN` to mark the migration as ran if it fails.
- Functions/Procs: Use `runOnChange: true` to make the migration repeatable.
- Simple SQL: Use `IF NOT EXISTS` to make the migration repeatable.
