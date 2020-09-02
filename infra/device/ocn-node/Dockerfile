FROM openchargingnetwork/ocn-node:1.1.0-rc1

COPY application.properties /ocn-node/src/main/resources/
CMD ["java", "-Dspring.config.location=/ocn-node/src/main/resources/application.properties", "-jar", "/ocn-node/libs/ocn-node-1.1.0-rc1.jar"]