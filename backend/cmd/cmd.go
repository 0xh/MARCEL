package cmd

import (
	"github.com/spf13/cobra"
)

var Cmd = &cobra.Command{
	Use:   "marcel",
	Short: "",
	Run: func(cmd *cobra.Command, args []string) {
		// Do Stuff Here
	},
}
