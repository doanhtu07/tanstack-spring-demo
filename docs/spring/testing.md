# Testing

Surefire is enabled by default by Maven, but we want to be explicit in `pom.xml`

Failsafe is not enabled by default, so we need to add the plugin with specific version in `pom.xml`

## Unit tests

Surefire is used for unit tests

Surefire automatically detects test classes based on naming conventions:

- \*Test.java → e.g., UserServiceTest.java
- Test\*.java → e.g., TestUserService.java
- \*Tests.java → e.g., UserServiceTests.java

## Integration tests

Failsafe is used for integration tests

Failsafe automatically detects test classes based on naming conventions:

- \*IT.java → e.g., UserServiceIT.java
- \*ITCase.java → e.g., UserServiceITCase.java

## Terms

JUnit is the test framework

Surefire / Failsafe are the Maven plugins that run the tests

---

JUnit → defines tests, annotations (@Test, @BeforeEach), and how the tests are executed in the JVM.

Surefire → runs unit tests during the test phase. It looks for classes matching \*Test.java and executes the JUnit tests inside them.

Failsafe → runs integration tests during integration-test and verify phases. It looks for classes matching *IT.java or *ITCase.java and executes the JUnit tests inside them.

## DataJpaTest vs SpringBootTest

@DataJpaTest is a slice test annotation that focuses on testing JPA repositories. It sets up an in-memory database (or our custom test database) and configures only the components related to data access, making it faster for testing repository logic.

@SpringBootTest is a more comprehensive annotation that loads the entire application context, allowing you to test the full stack of your application. It is suitable for integration tests that require all components to be available, but it can be slower than slice tests like @DataJpaTest.

## Testcontainers

Testcontainers is a Java library that provides lightweight, throwaway instances of common databases, Selenium web browsers, or anything else that can run in a Docker container. It is often used in integration testing to provide a real database environment without the overhead of managing it manually.

To use it, we just create a container bean inside `TestcontainersConfig` and import with `@Import(TestcontainersConfig.class)`

```java
@TestConfiguration(proxyBeanMethods = false)
public class TestcontainersConfig {

    @Bean
    @ServiceConnection
    PostgreSQLContainer postgresContainer() {
        return new PostgreSQLContainer(DockerImageName.parse("postgres:18-alpine"));
    }

}
```

## Application context during tests

For each type of Spring tests

- @DataJpaTest
- @SpringBootTest
- ...

Each type has its own application context configuration and lifecycle.

Tests of similar types can share the same application context, which is cached and reused across tests to speed up execution.

---

Spring generates a unique cache key for every test based on its configuration. If two test classes have the same "key," Spring reuses the existing context from its ContextCache instead of starting a new one.

Factors that make a configuration "unique" (and can break caching if they differ):

- Active profiles (e.g., @ActiveProfiles("test")).
- Custom properties (e.g., @TestPropertySource).
- The use of @MockBean or @SpyBean (each unique mock configuration creates a new context).
- Different component scan settings or context initializers.

## Mocking

There are many strategies:

### @Import a test config class with @Bean definitions

You can use @Import to import a test configuration class that defines beans with @Bean, which replaces the internal behavior of certain functions

Example: Replace the default DateTimeProvider with a fixed one to ensure consistent timestamps during tests that rely on Spring Audit @CreatedDate createdAt or @LastModifiedDate updatedAt fields.

```java
@Configuration
@EnableJpaAuditing
public class TestFixedTimeConfig {

    public static Instant fixedInstant = Instant.parse("2025-01-01T10:00:00.00Z");

    @Bean
    public DateTimeProvider dateTimeProvider() {
        return () -> Optional.of(fixedInstant);
    }

}

@DataJpaTest
@ActiveProfiles("test")
@ImportAutoConfiguration(LiquibaseAutoConfiguration.class)
@Import({TestFixedTimeConfig.class, TestcontainersConfig.class})
class AppUserUtcIT {
    // ...
}
```
