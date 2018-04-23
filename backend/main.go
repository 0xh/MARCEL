//go:generate swagger generate spec -o ./swagger.json

// Package main MARCEL APIs
//
// Provide API to access medias information
//
//     Host: localhost:8090
//     BasePath: /api/v1/
//     Version: 1.1
//     License: MIT http://opensource.org/licenses/MIT
//     Contact: Gwennael Buchet<gwennael.buchet@gmail.com>
//
// swagger:meta
package main

import (
	"github.com/Zenika/MARCEL/backend/cmd"

	// Import subcommands
	_ "github.com/Zenika/MARCEL/backend/auth/cmd"
)

func main() {
	cmd.Cmd.Execute()
}
