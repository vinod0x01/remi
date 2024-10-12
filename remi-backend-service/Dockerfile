FROM maven:3.8.1-openjdk-17 AS builder
WORKDIR /usr/src/app
COPY src ./src
COPY pom.xml .
RUN mvn clean install -DskipTests

FROM openjdk:17-jdk-alpine
MAINTAINER vinod
WORKDIR /usr/app
COPY --from=builder /usr/src/app/target/backend-0.0.1-SNAPSHOT.jar /usr/app/backend-0.0.1-SNAPSHOT.jar
ENV PATH="${PATH}:${JAVA_HOME}/bin"
EXPOSE 8080
ENTRYPOINT [ "java", "-jar", "/usr/app/backend-0.0.1-SNAPSHOT.jar"]