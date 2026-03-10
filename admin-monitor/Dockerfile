# https://spring.io/guides/gs/spring-boot-docker

# MARK: Build image

FROM eclipse-temurin:25-alpine AS builder-stage

WORKDIR /builder
COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# MARK: Runtime image

FROM eclipse-temurin:25-alpine AS runner-stage

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

WORKDIR /runner
COPY --from=builder-stage /builder/target/*.jar ./app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
