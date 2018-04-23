package cmd

import (
	"github.com/Zenika/MARCEL/backend/app"
	"github.com/spf13/cobra"
)

var Cmd = &cobra.Command{
	Use:   "marcel",
	Short: "",
	Args:  cobra.NoArgs,
	Run: func(cmd *cobra.Command, args []string) {
		a := new(app.App)
		a.Initialize()
		a.Run(":8090")
	},
}
