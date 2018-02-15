FROM alpine:3.6

WORKDIR /var/lib/marcel-auth-backend
EXPOSE 8091
ENTRYPOINT ["marcel-auth-backend"]
VOLUME /var/lib/marcel-auth-backend/data

COPY config/config.example.json /etc/marcel-auth-backend/config/config.json
COPY config/users.example.json /var/lib/marcel-auth-backend/data/users.json

RUN ln -s /etc/marcel-auth-backend/config /var/lib/marcel-auth-backend

COPY auth-backend /usr/local/bin/marcel-auth-backend
