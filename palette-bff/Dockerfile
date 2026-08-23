FROM eclipse-temurin:21-jre-alpine AS runtime

RUN addgroup -S palette && adduser -S palette -G palette
WORKDIR /app

COPY target/palette-bff-*.jar app.jar
RUN chown -R palette:palette /app
USER palette

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
