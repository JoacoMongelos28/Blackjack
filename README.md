# 🃏🃏 Blackjack

Blackjack is a card game designed to provide a realistic and entertaining casino experience. Players can place bets, double down, split hands, and manage their balance while enjoying a user-friendly and dynamic interface. This project includes advanced features, such as saving player progress and handling automatic notifications about game outcomes.<br>

## ✨ Features:<br>
•	🔍 **Game Filter:** Offers an interactive search tool to find related games.<br>
•	✂️ **Hand Splitting:** Allows splitting a hand into two when identical cards are dealt.<br>
•	🔔 **Pop-up Notifications:** Automatic messages that inform the player of game results.<br>
•	💻 **Login Popups:** Manages game access with real-time validations and error messages.<br>
•	💰 **Bets and Balance:** Enables placing and managing bets with a balance system stored in a database.<br><br>

## 💻 Technologies:<br>
•	**Backend:** Java<br>
•	**Database:** MySQL<br>
•	**ORMs:** Hibernate | JPA<br>
•	**API:** Mercado Pago API<br>
•	**Framework:** Spring Boot<br>
• **Template Engine:** Thymeleaf<br>
•	**Frontend:** HTML5 | CSS3 | JavaScript<br>
• **Management and Automation Tool:** Maven<br><br>

> [!NOTE]
> ## Prerequisites:<br>
>• **MYSQL**<br>
>• **Java SDK 11**<br>
>• **Intellij IDEA (Optional)**<br>

<br>

> [!IMPORTANT]
> ## 🚀 How to install locally
> ### 1.	Clone Repository:
> ```bash
> git clone https://github.com/JoacoMongelos28/Blackjack.git
> ```
> ### 2.	Create Database in MySQL:
> ```bash
> CREATE DATABASE blackjack;
> ```
> ### 3.	Open application and integrate Java SDK 11 if it asks you
> ### 4.	Synchronize Hibernate with your Database.
> **Go to src/main/java/config/HibernateConfig**
> ```bash
> dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver"); --> Configure according to the drivers of your Database
> dataSource.setUrl("jdbc:mysql://localhost:3306/blackjack"); --> Configure according to your Database
> dataSource.setUsername("YOUR_USERNAME");
> dataSource.setPassword("YOUR_PASSWORD");
> ```
> ### 5.  Modify the Mercado Pago service with your access token and replace "apiUrl" with the following URL.
> ```bash
> private String apiKey = YOUR_ACCESS_TOKEN;
> private String apiUrl = "https://api.mercadopago.com/checkout/preferences";
> ```
> ### 6.	Start the project with Jetty:Run.
> **Go to the "m" of Maven in the right bar --> Open Spring Web MVC --> Plugins --> Jetty --> Jetty:Run**
> ### 7.	Open Web at:
> **http://localhost:8080/home**
> ### 8.  Sign Up and Play
> ### 9.  If you want to deposit more balance, you must log in and pay using the following Mercado Pago account
> ```bash
> User: TESTUSER2053005099
> Password: FC981613#be14#4f1f#
> Verification code: 810057
> ```

<br>

> [!TIP]
> If the Blackjack page becomes misaligned, reduce the page zoom.

## 📫 Contact me
• 🌐 [Portfolio](https://joaquinmongelos.netlify.app/)<br>
• 💼 [LinkedIn - Joaquin Mongelos](https://www.linkedin.com/in/joaquinmongelos)<br>
• 📧 Email: joaquinmongelos75@gmail.com
