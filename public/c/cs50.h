/*
 * CS50 kutubxonasining brauzer versiyasi (asl: https://github.com/cs50/libcs50).
 * Funksiyalar runtime.c da. get_string qaytargan satrni free qilish shart emas.
 */
#ifndef CS50_H
#define CS50_H

#include <float.h>
#include <limits.h>
#include <stdbool.h>
#include <stdlib.h>

typedef char *string;

char get_char(const char *format, ...) __attribute__((format(printf, 1, 2)));
double get_double(const char *format, ...) __attribute__((format(printf, 1, 2)));
float get_float(const char *format, ...) __attribute__((format(printf, 1, 2)));
int get_int(const char *format, ...) __attribute__((format(printf, 1, 2)));
long get_long(const char *format, ...) __attribute__((format(printf, 1, 2)));
string get_string(const char *format, ...) __attribute__((format(printf, 1, 2)));

#endif
