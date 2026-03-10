# https://spring.io/guides/gs/spring-boot-docker

# MARK: Build image

FROM eclipse-temurin:25-alpine AS build-stage

WORKDIR /build
COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# MARK: Runtime image

FROM eclipse-temurin:25-alpine

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

WORKDIR /runtime
COPY --from=build-stage /build/target/*.jar ./app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
