echo "Installing go dependencies..."
echo ""
echo "    - github.com/rs/cors"
go get github.com/rs/cors
echo "    - github.com/gorilla/mux"
go get -u github.com/gorilla/mux
echo "    - github.com/gorilla/websocket"
go get github.com/gorilla/websocket
echo "    - github.com/mitchellh/mapstructure"
go get github.com/mitchellh/mapstructure
echo ""
echo "Go dependencies installation finished"