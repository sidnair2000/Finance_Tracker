library(tidyverse)
library(DBI)
library(RPostgres)
library(dotenv)

load_dot_env()

readRenviron(".env")
db_host <- Sys.getenv("DB_Host")
db_port <- 5432
db_name <- Sys.getenv("db_name")
db_user <- Sys.getenv("DB_User")
db_password <- Sys.getenv("DB_Password")




con <- NULL




args <- commandArgs(trailingOnly = TRUE)
output_file <- ifelse(length(args) > 0, args[1], "plot.png")
username <-args[2]
# print(username)

tryCatch({
  con <- dbConnect(RPostgres::Postgres(),
                   dbname = db_name,
                   host = db_host,
                   port = db_port,
                   user = db_user,
                   password = db_password)

  # If connection is successful, print success message
  cat("Connected to the database successfully!\n")

  # Optionally, you can run a simple query to test
  test_query <- "SELECT * from expenses where username = $1"  # This query returns the current timestamp
  result <- dbGetQuery(con, test_query,params=list(username))
  print(result)
  
}, error = function(e) {
  # Print error message if the connection fails
  cat("Failed to connect to the database:\n", e$message, "\n")
})

# Disconnect from the database if connected
if (!is.null(con)) {
  dbDisconnect(con)
}

plot <- result %>%
  ggplot(aes(x = month, y = cost)) +
  geom_point(color = "blue") +
  geom_line() +
  facet_wrap(~year)+
  labs(title = "Monthwise Expenses",
       x = "Month",
       y = "Expenses") +
  theme_minimal()







# Save the plot as a PNG image
ggsave(output_file, plot = plot, width = 6, height = 4, dpi = 300)


