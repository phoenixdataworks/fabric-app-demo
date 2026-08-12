# Schema context

These Markdown files are in [schema_scraper](https://github.com/phoenixdataworks/schema_scraper) table format.

In production, generate them from the warehouse or SQL endpoint:

```bash
schema-scraper scrape -t mssql -h <host> -d <database> --trusted
```

This demo commits a small fictional **migration program** schema so Cursor has high-quality context without a live database.

Cursor rules in `.cursor/rules/schema-grounding.mdc` point here. **Never invent columns that are not listed.**
