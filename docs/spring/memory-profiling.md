# Memory & Profiling

## Jackson JsonMapper

Creating a new JsonMapper every time can be expensive. Consider creating a bean for it or injecting a default instance
that Spring provides.

## Proxy Bean methods

Using proxy bean methods can be expensive and unnecessary.

Modern Spring usually recommends using `@Configuration(proxyBeanMethods = false)` to avoid creating unnecessary proxy
beans.

To orchestrate your beans, use Dependency Injection (DI) to manage the lifecycle of your beans instead of calling bean
methods directly.

`proxyBeanMethods = true` is the default mostly for backward compatibility.

## Bean lazy initialization

Resources:

- https://medium.com/@AlexanderObregon/how-spring-boot-optimizes-startup-with-lazy-initialization-5467adb89fa0

## Profiling

Resources:

- https://medium.com/@AlexanderObregon/spring-boot-application-profiling-and-tuning-for-better-efficiency-e90e63ac08dd
- https://www.syscrest.com/2025/02/securing-spring-boot-actuator/
- https://github.com/codecentric/spring-boot-admin?tab=readme-ov-file

### Spring Boot Admin

Spring Boot Admin is a UI tool for monitoring and managing Spring Boot applications through their Actuator endpoints.
