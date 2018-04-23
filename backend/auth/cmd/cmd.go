package cmd

import (
	"github.com/Zenika/MARCEL/backend/auth/app"
	"github.com/Zenika/MARCEL/backend/auth/conf"
	"github.com/Zenika/MARCEL/backend/auth/users"
	"github.com/Zenika/MARCEL/backend/cmd"
	"github.com/spf13/cobra"
)

var _cmd = &cobra.Command{
	Use:   "auth",
	Short: "",
	Args:  cobra.NoArgs,
	Run: func(cmd *cobra.Command, args []string) {
		config := conf.LoadConfig()
		users.LoadUsersData()
		app.Run(config)
	},
}

func init() {
	cmd.Cmd.AddCommand(_cmd)
}
