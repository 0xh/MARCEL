package main

import (
	"github.com/Zenika/MARCEL/backend/auth/app"
	"github.com/Zenika/MARCEL/backend/auth/conf"
	"github.com/Zenika/MARCEL/backend/auth/users"
)

func main() {
	config := conf.LoadConfig()
	users.LoadUsersData()
	app.Run(config)
}
