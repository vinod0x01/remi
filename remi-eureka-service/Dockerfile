FROM maven:3.8.1-openjdk-17 AS builder
WORKDIR /usr/src/app
COPY src ./src
COPY pom.xml .
RUN mvn clean install -DskipTests

FROM openjdk:17-jdk-alpine
MAINTAINER Vinod
WORKDIR /usr/app
COPY --from=builder /usr/src/app/target/eurekaServer.jar /usr/app/eurekaServer.jar
ENV PATH="${PATH}:${JAVA_HOME}/bin"
EXPOSE 8761
ENTRYPOINT [ "java", "-jar", "/usr/app/eurekaServer.jar"]
