# Spring Audit

Spring provides built-in support for easily customizable audit fields like @CreatedDate createdAt, @LastModifiedDate updatedAt, @CreatedBy createdBy, and @LastModifiedBy updatedBy

To make it work, remember to have these:

1. Enable JPA auditing with @EnableJpaAuditing in a configuration class
2. Add @EntityListeners(AuditingEntityListener.class) to your entity class
3. Add the audit fields with the appropriate annotations (@CreatedDate, @LastModifiedDate, ...)
4. Configure the auditor aware bean to provide the current user for @CreatedBy and @LastModifiedBy fields (if you use these features)
